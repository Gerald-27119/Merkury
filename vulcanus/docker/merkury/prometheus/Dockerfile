# Use the correct Prometheus image from the prom/prometheus repository
FROM prom/prometheus:latest

# Copy your custom Prometheus configuration file into the container
COPY prometheus.yml /etc/prometheus/prometheus.yml

# Set the entrypoint to start Prometheus with the specified configuration file
ENTRYPOINT ["/bin/prometheus"]
CMD ["--config.file=/etc/prometheus/prometheus.yml"]
