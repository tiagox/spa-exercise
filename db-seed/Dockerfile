FROM mongo:latest

COPY initial-data.json /initial-data.json

CMD mongoimport \
    --host db \
    --db spa-exercise \
    --collection items \
    --type json \
    --file /initial-data.json \
    --jsonArray