docker-compose down
docker-compose up -d
docker-compose exec mysql bash -c "mysql -prootroot < /tmp/todos.sql"