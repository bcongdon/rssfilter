docker:
	docker build -t gcr.io/rssfilter/rssfilter .
docker-upload:
	gcloud docker -- push gcr.io/rssfilter/rssfilter

cloud-run: docker docker-upload

clean:
	cargo clean
