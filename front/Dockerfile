# ---------------------------------------------------
# Etapa común: instalar dependencias
#---------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Copiamos solo los manifests para cachear instalación
COPY package.json yarn.lock ./

# Instalamos deps con Yarn
RUN yarn install

# ---------------------------------------------------
# Etapa de desarrollo
# ---------------------------------------------------
FROM deps AS development

# Pass the variable into the image
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copiamos el resto del código (src, vite.config.ts, etc)
COPY . .

# Exponemos el puerto que usa Vite
EXPOSE 5173

# Comando por defecto: modo dev
CMD ["yarn", "dev"]

# ---------------------------------------------------
# Etapa de build para producción
# ---------------------------------------------------
FROM deps AS build

# Copiamos el resto del código
COPY . .

# Build de producción con TypeScript + Vite
RUN yarn build

# ---------------------------------------------------
# Etapa final: servir con Nginx
# ---------------------------------------------------
FROM nginx:stable-alpine AS production

# Eliminamos la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestra configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/

# Copiamos los assets estáticos generados
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Arrancamos Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
  