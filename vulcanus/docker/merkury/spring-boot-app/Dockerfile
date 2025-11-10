FROM eclipse-temurin:21-jre-jammy

ENV SPRING_PROFILES_ACTIVE=docker

COPY ./vulcanus.jar /app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]
