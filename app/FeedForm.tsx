import * as React from 'react';
import { Formik, Field as FormikField, FormikActions, FormikProps, FieldProps } from 'formik';
import { Divider, Button, Form, Message } from 'semantic-ui-react';
import validUrl from 'valid-url';

export interface FeedFormValues {
  feedUrl: string;
  titleReject: string;
  titleAccept: string;
  authorReject: string;
  authorAccept: string;
}

interface Props {
  onSubmit: (formValues: FeedFormValues) => void;
}

export class FeedForm extends React.Component<Props, FeedFormValues> {
  state: Readonly<FeedFormValues> = {
    feedUrl: '',
    titleAccept: '',
    titleReject: '',
    authorAccept: '',
    authorReject: '',
  };

  render() {
    return (
      <Formik
        initialValues={{ feedUrl: '', titleAccept: '', titleReject: '' }}
        onSubmit={(values: FeedFormValues, actions: FormikActions<FeedFormValues>) => {
          this.props.onSubmit(values);
          actions.setSubmitting(false);
        }}
        validate={(values: FeedFormValues) => {
          if (!validUrl.isWebUri(values.feedUrl)) {
            return { feedUrl: 'Invalid Url' };
          }
        }}
        render={(formikBag: FormikProps<FeedFormValues>) => (
          <Form error={Boolean(formikBag.errors.feedUrl)}>
            <FormikField
              name="feedUrl"
              render={({ field, form }: FieldProps<FeedFormValues>) => {
                const hasError = form.touched.feedUrl && Boolean(form.errors.feedUrl);
                return (
                  <>
                    <p>{formikBag.error}</p>
                    <Form.Field required error={hasError}>
                      <label>RSS Feed URL</label>
                      <input type="text" {...field} placeholder="RSS Feed URL" />
                    </Form.Field>
                    {hasError && <Message error content={formikBag.errors.feedUrl} />}
                  </>
                );
              }}
            />
            <Divider />

            {/* Title Filters */}
            <Form.Group widths="equal">
              <FormikField
                name="titleAccept"
                render={({ field, form }: FieldProps<FeedFormValues>) => {
                  const hasError = form.touched.titleAccept && Boolean(form.errors.titleAccept);
                  return (
                    <Form.Field error={hasError}>
                      <label>Title Accept</label>
                      <input type="text" {...field} placeholder="A regex for titles to accept" />
                      {hasError ? <Message error content={form.errors.titleAccept} /> : null}
                    </Form.Field>
                  );
                }}
              />
              <FormikField
                name="titleReject"
                render={({ field, form }: FieldProps<FeedFormValues>) => (
                  <Form.Field>
                    <label>Title Reject</label>
                    <input type="text" {...field} placeholder="A regex for titles to reject" />
                    {form.touched.titleReject && form.errors.titleReject && form.errors.titleReject}
                  </Form.Field>
                )}
              />
            </Form.Group>
            {/* Author Filters */}
            <Form.Group widths="equal">
              <FormikField
                name="authorAccept"
                render={({ field, form }: FieldProps<FeedFormValues>) => {
                  const hasError = form.touched.authorAccept && Boolean(form.errors.authorAccept);
                  return (
                    <Form.Field error={hasError}>
                      <label>Author Accept</label>
                      <input type="text" {...field} placeholder="A regex for authors to accept" />
                      {hasError ? <Message error content={form.errors.authorAccept} /> : null}
                    </Form.Field>
                  );
                }}
              />
              <FormikField
                name="authorReject"
                render={({ field, form }: FieldProps<FeedFormValues>) => (
                  <Form.Field>
                    <label>Author Reject</label>
                    <input type="text" {...field} placeholder="A regex for authors to reject" />
                    {form.touched.authorReject &&
                      form.errors.authorReject &&
                      form.errors.authorReject}
                  </Form.Field>
                )}
              />
            </Form.Group>
            <Divider />
            <Button color="green" onClick={formikBag.submitForm}>
              Get Feed
            </Button>
          </Form>
        )}
      />
    );
  }
}
