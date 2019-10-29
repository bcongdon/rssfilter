import * as React from 'react';
import { Feed, Segment, Header, Divider, Checkbox, Icon } from 'semantic-ui-react';
import { FeedItem, FeedPreviewItem } from './FeedPreviewItem';
import axios from 'axios';

interface Props {
  feedUrl: string;
}

interface State {
  loading: boolean;
  feedItems: Array<FeedItem>;
  showExcludedPosts: boolean;
  feedError: boolean;
}

export default class FeedPreview extends React.Component<Props, State> {
  state: Readonly<State> = {
    loading: true,
    feedItems: [],
    showExcludedPosts: false,
    feedError: false,
  };

  private async loadFeed(feedUrl: string) {
    await this.setState({ loading: true, feedItems: [], feedError: false });

    let response;
    try {
      response = await axios.get(feedUrl);
    } catch {
      this.setState({ loading: false, feedError: true });
      return;
    }

    let feedItems: Array<FeedItem> = response.data.items.map((item: any) => {
      const included = item.included;
      return { included, ...item.item };
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
    const { loading, feedItems, showExcludedPosts, feedError } = this.state;

    let feedPreviewItems = feedItems
      .filter(feedItem => showExcludedPosts || feedItem.included)
      .map((feedItem, idx, arr) => (
        <React.Fragment key={idx}>
          <FeedPreviewItem {...feedItem} />
          {idx !== arr.length - 1 ? <Divider /> : null}
        </React.Fragment>
      ));

    let content;
    if (loading) {
      content = null;
    } else if (feedError) {
      content = (
        <Segment placeholder textAlign="center">
          <Header icon color="red">
            <Icon name="warning sign" />
            Error loading feed.
          </Header>
          Check that the feed URL is correct, and that it points to a valid RSS or Atom feed.
        </Segment>
      );
    } else if (feedPreviewItems.length === 0) {
      content = (
        <Segment placeholder>
          <Header icon>
            <Icon name="search" />
            No feed items matched the filter.
          </Header>
        </Segment>
      );
    } else {
      content = feedPreviewItems;
    }

    return (
      <Segment loading={loading}>
        <Header as="h3">Preview</Header>
        <Checkbox
          label="Show excluded posts"
          checked={showExcludedPosts}
          onChange={this.toggleShowExcludedPosts}
        />
        <Feed style={{ minHeight: 100, maxHeight: 500, overflowY: 'auto' }}>{content}</Feed>
      </Segment>
    );
  }
}
