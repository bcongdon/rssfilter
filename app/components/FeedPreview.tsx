import * as React from 'react';
import { Feed, Segment, Header, Divider, Checkbox } from 'semantic-ui-react';
import { FeedItem, FeedPreviewItem } from './FeedPreviewItem';
import Parser from 'rss-parser';

interface Props {
  feedUrl: string;
}

interface State {
  loading: boolean;
  feedItems: Array<FeedItem>;
  showExcludedPosts: boolean;
}

export default class FeedPreview extends React.Component<Props, State> {
  state: Readonly<State> = {
    loading: false,
    feedItems: [],
    showExcludedPosts: false,
  };

  private async loadFeed(feedUrl: string) {
    this.setState({ loading: true, feedItems: [] });
    let parser = new Parser();
    let feed = await parser.parseURL(feedUrl);
    let feedItems: Array<FeedItem> = feed.items.map(item => {
      return {
        title: item.title,
        url: item.link,
        date: item.pubDate,
        included: item.title.startsWith('A'),
      };
    });
    this.setState({ loading: false, feedItems });
  }

  componentDidMount() {
    this.loadFeed(this.props.feedUrl);
  }

  componentWillReceiveProps(nextProps: Readonly<Props>) {
    if (nextProps.feedUrl !== this.props.feedUrl) {
      this.loadFeed(nextProps.feedUrl);
    }
  }

  toggleShowExcludedPosts = () => {
    this.setState(prevState => ({ showExcludedPosts: !prevState.showExcludedPosts }));
  };

  render() {
    const { loading, feedItems, showExcludedPosts } = this.state;

    return (
      <Segment loading={loading}>
        <Header as="h3">Preview</Header>
        <Checkbox
          label="Show excluded posts"
          checked={showExcludedPosts}
          onChange={this.toggleShowExcludedPosts}
        />
        <Feed style={{ minHeight: 100, maxHeight: 500, overflowY: 'auto' }}>
          {feedItems
            .filter(feedItem => showExcludedPosts || feedItem.included)
            .map(feedItem => (
              <>
                <FeedPreviewItem {...feedItem} key={feedItem.url} />
                <Divider />
              </>
            ))}
        </Feed>
      </Segment>
    );
  }
}
