FROM openjdk:11
MAINTAINER Michael Gargano "michael.gargano@jax.org"
ARG google_creds
ARG cloudsql_username
ARG cloudsql_password
ENV GOOGLE_APPLICATION_CREDENTIALS $google_creds
ENV HPO_CLOUD_SQL_USERNAME $cloudsql_username
ENV HPO_CLOUD_SQL_PASSWORD $cloudsql_password
EXPOSE 8080

WORKDIR /app
COPY *.jar application.jar

CMD ["java","-Djava.security.egd=file:/dev/./urandom","-Dgrails.env=gcp","-jar","/app/application.jar"]
