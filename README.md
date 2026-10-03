# The Burger Station

Aplicación de pedidos de hamburguesas hecha como prueba técnica fullstack.
Frontend en React, backend en Python con FastAPI y base de datos PostgreSQL, todo dockerizado.

## Enlaces

- Aplicación: _pendiente_
- Swagger: _pendiente_
- Figma: _pendiente_

## Ejecutar en local

Hace falta tener Docker Desktop abierto.

```bash
git clone https://github.com/Ahegaox/burger-station.git
cd burger-station
cp .env.example .env
cp backend/.env.example backend/.env
docker compose up -d --build
```

- Aplicación: http://localhost:3000
- Swagger: http://localhost:8000/docs

Para que se envíen los emails hay que rellenar las dos variables de SendGrid en `backend/.env`.

## Decisiones

- **El precio lo calcula el servidor.** El frontend solo envía qué productos se piden y cuántos. El backend busca los precios en la base de datos y calcula el total, para que nadie pueda cambiar el precio modificando la petición desde el navegador.
- **Cada sabor de gaseosa es un producto distinto.** El enunciado pone "Gaseosa (Cola, Naranja, Lima-Limón)" como una sola línea. La separé en tres productos para que el pedido guarde qué sabor se pidió. Hice lo mismo con el extra de queso (cheddar y mozzarella).
- **Si falla el email, el pedido se guarda igualmente.** El email se envía después de responder al usuario. Si SendGrid da error, queda registrado en el log, pero el pedido ya está creado.

## A tener en cuenta

- El backend desplegado se apaga cuando no se usa, así que la primera petición puede tardar un minuto.
- El email de confirmación puede llegar a spam.