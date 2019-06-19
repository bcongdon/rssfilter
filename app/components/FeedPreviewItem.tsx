import * as React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Feed, Icon, Popup } from 'semantic-ui-react';

dayjs.extend(relativeTime);

export interface FeedItem {
  title: string;
  url: string;
  date?: string;
  author?: string;
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
        <a href={props.url} target="_blank">
          {props.title}
        </a>
      </Feed.Summary>
      <Feed.Meta>
        {props.date || props.author ? (
          <Feed.Date>
            {props.author}
            {props.author && props.date ? ' • ' : null}
            <span title={props.date}>{dayjs(props.date).fromNow()}</span>
          </Feed.Date>
        ) : null}
      </Feed.Meta>
    </Feed.Content>
  </Feed.Event>
);

export { FeedPreviewItem };
