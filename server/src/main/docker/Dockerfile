FROM openjdk:11
MAINTAINER Michael Gargano "michael.gargano@jax.org"

EXPOSE 8080

WORKDIR /app
COPY *.jar application.jar

CMD ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app/application.jar"]
