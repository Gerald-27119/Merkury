FROM openjdk:21-slim

ENV SPRING_PROFILES_ACTIVE=docker

COPY ./vulcanus.jar /app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]
