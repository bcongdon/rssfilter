use failure::Fail;
use reqwest::{header, Client};
use rss::Channel;
use std::error::Error;
use std::io::Read;

#[derive(Fail, Debug)]
#[fail(display = "Error loading feed: {}.", _0)]
struct FeedError(String);

pub struct FeedItem {
    pub title: String,
}

pub enum Feed {
    RSS(rss::Channel),
    Atom(atom_syndication::Feed),
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
            return Ok(Feed::RSS(rss_feed));
        }

        match atom_syndication::Feed::read_from(&content[..]) {
            Ok(atom_feed) => Ok(Feed::Atom(atom_feed)),
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
                    .filter(|item| {
                        if let Some(title) = item.title() {
                            let feed_item = FeedItem {
                                title: title.to_string(),
                            };
                            predicate(feed_item)
                        } else {
                            false
                        }
                    })
                    .cloned()
                    .collect();
                rss_feed.set_items(new_items)
            }
            Feed::Atom(atom_feed) => {
                let new_entries: Vec<atom_syndication::Entry> = atom_feed
                    .entries()
                    .iter()
                    .filter(|entry| {
                        let feed_item = FeedItem {
                            title: entry.title().to_string(),
                        };
                        predicate(feed_item)
                    })
                    .cloned()
                    .collect();
                atom_feed.set_entries(new_entries);
            }
        }
    }
}
