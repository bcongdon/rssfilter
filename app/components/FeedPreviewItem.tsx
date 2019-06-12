import * as React from 'react';
import { Feed, Icon, Popup } from 'semantic-ui-react';

export interface FeedItem {
  title: string;
  url: string;
  date?: string;
  included: boolean;
}

const IncludedIcon: React.FunctionComponent<{}> = () => (
  <Popup content="Included" trigger={<Icon name="check circle" color="green" />} />
);

const ExcludedIcon: React.FunctionComponent<{}> = () => (
  <Popup content="Excluded" trigger={<Icon name="times circle" color="grey" />} />
);

const FeedPreviewItem: React.FunctionComponent<FeedItem> = props => (
  <Feed.Event>
    <Feed.Label>{props.included ? <IncludedIcon /> : <ExcludedIcon />}</Feed.Label>
    <Feed.Content>
      <Feed.Summary>
        <a href={props.url}>{props.title}</a>
      </Feed.Summary>
      <Feed.Meta>{props.date ? <Feed.Date>{props.date}</Feed.Date> : null}</Feed.Meta>
    </Feed.Content>
  </Feed.Event>
);

export { FeedPreviewItem };
