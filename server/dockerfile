# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore for caching
COPY ["server.csproj", "."]
RUN dotnet restore "server.csproj"

# Copy the rest of the source code
# Build and publish the project
COPY . .
RUN dotnet publish "server.csproj" -c Release -o /app/publish

# Run stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
ENV ASPNETCORE_HTTP_PORTS=5095
EXPOSE 5095
WORKDIR /app

# Copy the published app from the build stage
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "server.dll"]