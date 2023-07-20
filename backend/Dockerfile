FROM oraclelinux:8

RUN dnf -y update

# Start Node.JS for Oracle Linux: https://yum.oracle.com/oracle-linux-nodejs.html
RUN dnf -y module enable nodejs:18 && \
    dnf -y install nodejs npm && \
    rm -rf /var/cache/dnf
# End Node.JS for Oracle Linux: https://yum.oracle.com/oracle-linux-nodejs.html

WORKDIR /app

COPY . ./
RUN npm ci --production

#Deco Args
ARG DECO_VERSION=0.3.1
ARG DECO_OS=linux
ARG DECO_ARCH=amd64

#Add Deco to the Image (Must)
ADD https://github.com/YaleUniversity/deco/releases/download/v${DECO_VERSION}/deco-v${DECO_VERSION}-${DECO_OS}-${DECO_ARCH} /usr/local/bin/deco
RUN chmod 555 /usr/local/bin/deco && deco version

RUN chmod 777 /app/entrypoint.sh
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
