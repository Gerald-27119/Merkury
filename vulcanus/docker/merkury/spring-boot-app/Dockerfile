FROM openjdk:21-slim

# Set environment variable for Spring Boot to use the docker profile
ENV SPRING_PROFILES_ACTIVE=docker

# Copy the Spring Boot jar file to the container
COPY ./vulcanus.jar /app.jar

# Define the entrypoint to run the application
ENTRYPOINT ["java", "-jar", "/app.jar"]
