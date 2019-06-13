use failure::Fail;
use reqwest::{header, Client};
use rss::Channel;
use std::convert::TryFrom;
use std::error::Error;
use std::io::Read;

#[derive(Fail, Debug)]
#[fail(display = "Error loading feed: {}.", _0)]
struct FeedError(String);

#[derive(Serialize, Clone)]
pub struct FeedItem {
    pub title: String,
    pub date: String,
    pub author: String,
}

type AtomItem = atom_syndication::Entry;
impl From<AtomItem> for FeedItem {
    fn from(atom_item: AtomItem) -> Self {
        FeedItem {
            title: atom_item.title().to_string(),
            date: atom_item.updated().to_string(),
            author: atom_item
                .authors()
                .iter()
                .map(|person| person.name().to_string())
                .collect::<Vec<String>>()
                .join(", "),
        }
    }
}

type RSSItem = rss::Item;
impl TryFrom<RSSItem> for FeedItem {
    type Error = &'static str;

    fn try_from(rss_item: RSSItem) -> Result<Self, Self::Error> {
        let title = match rss_item.title() {
            Some(title) => title.to_string(),
            None => return Err("No title"),
        };
        let date = rss_item.pub_date().unwrap_or_default().to_string();
        let author = rss_item.author().unwrap_or_default().to_string();
        Ok(FeedItem {
            title,
            date,
            author,
        })
    }
}

pub enum Feed {
    RSS(Box<rss::Channel>),
    Atom(Box<atom_syndication::Feed>),
}

impl Feed {
    pub fn from_url(url: &str) -> Result<Feed, Box<dyn Error>> {
        let client = Client::new();

        let mut content = Vec::new();
        client
            .get(url)
            .header(header::USER_AGENT, "RSSFilter")
            .send()?
            .read_to_end(&mut content)?;

        if let Ok(rss_feed) = Channel::read_from(&content[..]) {
            return Ok(Feed::RSS(Box::new(rss_feed)));
        }

        match atom_syndication::Feed::read_from(&content[..]) {
            Ok(atom_feed) => Ok(Feed::Atom(Box::new(atom_feed))),
            Err(err) => Err(Box::new(FeedError(err.to_string()).compat())),
        }
    }

    pub fn to_string(&self) -> String {
        match self {
            Feed::RSS(rss_feed) => rss_feed.to_string(),
            Feed::Atom(atom_feed) => atom_feed.to_string(),
        }
    }

    pub fn filter<F>(&mut self, predicate: F)
    where
        F: Fn(FeedItem) -> bool,
    {
        match self {
            Feed::RSS(rss_feed) => {
                let new_items: Vec<rss::Item> = rss_feed
                    .items()
                    .iter()
                    .cloned()
                    .filter(|item| match FeedItem::try_from(item.to_owned()) {
                        Ok(feed_item) => predicate(feed_item),
                        _ => false,
                    })
                    .collect();
                rss_feed.set_items(new_items)
            }
            Feed::Atom(atom_feed) => {
                let new_entries: Vec<atom_syndication::Entry> = atom_feed
                    .entries()
                    .iter()
                    .cloned()
                    .filter(|entry| predicate(FeedItem::from(entry.to_owned())))
                    .collect();
                atom_feed.set_entries(new_entries);
            }
        }
    }

    pub fn items(&self) -> Vec<FeedItem> {
        match self {
            Feed::RSS(rss_feed) => rss_feed
                .items()
                .iter()
                .cloned()
                .filter_map(|item| FeedItem::try_from(item).ok())
                .collect(),
            Feed::Atom(atom_feed) => atom_feed
                .entries()
                .iter()
                .cloned()
                .map(FeedItem::from)
                .collect(),
        }
    }
}
