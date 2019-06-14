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
}

export default class FeedPreview extends React.Component<Props, State> {
  state: Readonly<State> = {
    loading: true,
    feedItems: [],
    showExcludedPosts: false,
  };

  private async loadFeed(feedUrl: string) {
    await this.setState({ loading: true, feedItems: [] });
    const response = await axios.get(feedUrl);
    let feedItems: Array<FeedItem> = response.data.items.map((item: any) => {
      const included = item.included;
      const { author, date, title } = item.item;
      return { included, author, date, title };
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

    let feedPreviewItems = feedItems
      .filter(feedItem => showExcludedPosts || feedItem.included)
      .map(feedItem => (
        <>
          <FeedPreviewItem {...feedItem} key={feedItem.url} />
          <Divider />
        </>
      ));

    return (
      <Segment loading={loading}>
        <Header as="h3">Preview</Header>
        <Checkbox
          label="Show excluded posts"
          checked={showExcludedPosts}
          onChange={this.toggleShowExcludedPosts}
        />
        <Feed style={{ minHeight: 100, maxHeight: 500, overflowY: 'auto' }}>
          {loading || feedPreviewItems.length > 0 ? (
            feedPreviewItems
          ) : (
            <Segment placeholder>
              <Header icon>
                <Icon name="search" />
                No feed items matched the filter.
              </Header>
            </Segment>
          )}
        </Feed>
      </Segment>
    );
  }
}
