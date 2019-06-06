use regex::Regex;
use rocket::request::Form;

#[derive(FromForm, Debug)]
pub struct FeedQuery {
    url: String,
    title_reject: Option<String>,
    title_allow: Option<String>,
}

impl FeedQuery {
    fn filter(&self, item: &rss::Item) -> bool {
        let mut accepted = true;
        if let Some(title) = item.title() {
            if let Some(reject_re) = self
                .title_reject
                .as_ref()
                .and_then(|t| Regex::new(&t.to_string()).ok())
            {
                accepted &= !reject_re.is_match(title);
            }

            if let Some(allow_re) = self
                .title_allow
                .as_ref()
                .and_then(|t| Regex::new(&t.to_string()).ok())
            {
                accepted &= allow_re.is_match(title);
            }
        }

        accepted
    }
}

#[get("/")]
pub fn index() -> &'static str {
    "Application successfully started!"
}

#[get("/feed?<feed..>")]
pub fn get_feed(feed: Form<FeedQuery>) -> String {
    println!("{:?}", feed);
    let mut channel = rss::Channel::from_url(&feed.url).unwrap();
    let items: Vec<rss::Item> = channel
        .items()
        .iter()
        .filter(|&item| feed.filter(item))
        .cloned()
        .collect();
    channel.set_items(items);
    channel.to_string()
}
