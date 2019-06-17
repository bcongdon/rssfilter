<h1 align="center">RSSFilter</h1>
<p>
  <a href="https://github.com/bcongdon/rssfilter/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
  <a href="https://twitter.com/BenRCongdon">
    <img alt="Twitter: BenRCongdon" src="https://img.shields.io/twitter/follow/BenRCongdon.svg?style=social" target="_blank" />
  </a>
</p>

> Like email filters, but for RSS feeds.

### 🌎 [Live Version](https://rssfilter.xyz)

### 🏠 [Project Homepage](https://github.com/bcongdon/rssfilter#readme)

## Installation

(Note: You must have [npm](https://www.npmjs.com/get-npm) and [cargo](https://rustup.rs/) installed.)

1. `git clone https://github.com/bcongdon/rssfilter && cd rssfilter`
2. Install frontend dependencies: `npm install`
3. Install backend dependencies: `cargo build`

## Usage

### Backend

```sh
cargo run
```

### Frontend

```sh
npm run start
```

## Deploying to Google Cloud Run

1. Build the docker image:

   `docker build -t gcr.io/rssfilter/rssfilter .`

2. Upload to the GCP container image registry:

   `gcloud docker -- push gcr.io/myproject/rssfilter`

3. Deploy to Cloud Run:

   `TODO`

## Author

👤 **Benjamin Congdon**

- Twitter: [@BenRCongdon](https://twitter.com/benrcongdon)
- Github: [@bcongdon](https://github.com/bcongdon)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/bcongdon/rssfilter/issues).

**Guidelines:**

- Make sure that any frontend changes are linted with `npm run lint`
- Make sure that any backend changes pass clippy checks (`cargo clippy`), and are properly formatted with `rustfmt`.

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Benjamin Congdon](https://github.com/bcongdon).<br />
This project is [MIT](https://github.com/bcongdon/rssfilter/blob/master/LICENSE) licensed.
