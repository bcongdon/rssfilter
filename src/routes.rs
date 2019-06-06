use regex::Regex;
use rocket::http::hyper::header::{CacheControl, CacheDirective};
use rocket::http::RawStr;
use rocket::request::Form;
use rocket::request::FromFormValue;

#[derive(Debug)]
struct FilterRegex(Regex);

impl<'v> FromFormValue<'v> for FilterRegex {
    type Error = &'v RawStr;

    fn from_form_value(form_value: &'v RawStr) -> Result<FilterRegex, &'v RawStr> {
        match Regex::new(form_value.as_str()) {
            Ok(regex) => Ok(FilterRegex(regex)),
            _ => Err(form_value),
        }
    }
}

#[derive(FromForm, Debug)]
pub struct FeedQuery {
    url: String,
    title_reject: Option<FilterRegex>,
    title_allow: Option<FilterRegex>,
}

impl FeedQuery {
    fn filter(&self, item: &rss::Item) -> bool {
        let mut accepted = true;
        if let Some(title) = item.title() {
            if let Some(reject_re) = &self.title_reject {
                accepted &= !reject_re.0.is_match(title);
            }

            if let Some(allow_re) = &self.title_allow
            {
                accepted &= allow_re.0.is_match(title);
            }
        }

        accepted
    }
}

#[derive(Responder)]
#[response(status = 200, content_type = "xml")]
pub struct FeedQueryResponder {
    inner: String,
    cache_control: CacheControl,
}

#[get("/")]
pub fn index() -> &'static str {
    "Application successfully started!"
}

#[get("/feed?<feed..>")]
pub fn get_feed(feed: Form<FeedQuery>) -> FeedQueryResponder {
    println!("{:?}", feed);
    let mut channel = rss::Channel::from_url(&feed.url).unwrap();
    let items: Vec<rss::Item> = channel
        .items()
        .iter()
        .filter(|&item| feed.filter(item))
        .cloned()
        .collect();
    channel.set_items(items);
    FeedQueryResponder {
        inner: channel.to_string(),
        cache_control: CacheControl(vec![CacheDirective::MaxAge(3600)]),
    }
    // channel.to_string()
}
