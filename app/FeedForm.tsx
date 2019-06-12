import * as React from 'react';
import { Formik, FormikActions, FormikProps, Field, FieldProps } from 'formik';
import { Divider, Button, Input, Form } from 'semantic-ui-react';
import * as QueryString from 'query-string';

export interface FeedFormValues {
  feedURL: string;
  titleReject: string;
  titleAccept: string;
}

interface FeedFormProps {
  onChange: (formValues: FeedFormValues) => void;
  filterFeedURL?: string;
}

const baseURL: string = 'https://rssfilter-a7aj2utffa-uc.a.run.app';

export class FeedForm extends React.Component<FeedFormProps, FeedFormValues> {
  state: Readonly<FeedFormValues> = {
    feedURL: '',
    titleAccept: '',
    titleReject: '',
  };

  handleFeedURLChange = (event: React.FormEvent) => {
    this.setState({ feedURL: (event.target as HTMLSelectElement).value });
  };

  handleTitleAcceptChange = (event: React.FormEvent) => {
    this.setState({ titleReject: (event.target as HTMLSelectElement).value });
  };

  handleTitleRejectChange = (event: React.FormEvent) => {
    this.setState({ titleAccept: (event.target as HTMLSelectElement).value });
  };

  getFilterFeedURL(): string {
    const { feedURL, titleReject, titleAccept } = this.state;
    if (!feedURL) {
      return '';
    }

    let query: any = {
      url: feedURL,
      title_reject: titleReject,
      title_accept: titleAccept,
    };
    Object.keys(query).forEach(key => !query[key] && delete query[key]);
    const queryString = QueryString.stringify(query);
    return `${baseURL}/feed?${queryString}`;
  }

  render() {
    return (
      <Form>
        <Form.Field required>
          <label>RSS Feed URL</label>
          <input placeholder="RSS Feed URL" onChange={this.handleFeedURLChange} />
        </Form.Field>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Title Accept</label>
            <input placeholder="Title Accept" onChange={this.handleTitleAcceptChange} />
          </Form.Field>
          <Form.Field>
            <label>Title Reject</label>
            <input placeholder="Title Reject" onChange={this.handleTitleRejectChange} />
          </Form.Field>
        </Form.Group>
        <Divider />
        <Input
          action={{ color: 'teal', labelPosition: 'right', icon: 'copy', content: 'Copy' }}
          value={this.getFilterFeedURL()}
        ></Input>
      </Form>
    );
  }
}
