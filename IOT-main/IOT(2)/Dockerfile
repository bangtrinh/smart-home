FROM eclipse-temurin:17-jdk-jammy  AS builder

LABEL authors="hphuocthanh,Evan"

# Set the working directory inside the container
WORKDIR /app


COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY ./src ./src
# COPY .git .git
COPY .gitignore .gitignore
RUN ./mvnw clean install

FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Expose the port that your Spring Boot app runs on

COPY --from=builder /app/target/*.jar /app/*.jar

EXPOSE 8080
# Run the application
CMD ["sh", "-c", "java -jar /app/*.jar"]