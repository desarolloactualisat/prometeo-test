#!/usr/bin/env bash
set -e

echo "Esperando a que MariaDB esté disponible en $MYSQL_HOST:$MYSQL_PORT..."
until nc -z "$MYSQL_HOST" "$MYSQL_PORT"; do
  sleep 2
done

echo "MariaDB lista, ejecutando migraciones Alembic..."
alembic upgrade head

echo "Migraciones aplicadas. Iniciando la aplicación..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
