FROM oraclelinux:8

RUN dnf -y update

# Start Node.JS for Oracle Linux: https://yum.oracle.com/oracle-linux-nodejs.html
RUN dnf -y module enable nodejs:18 && \
    dnf -y install nodejs npm && \
    rm -rf /var/cache/dnf
# End Node.JS for Oracle Linux: https://yum.oracle.com/oracle-linux-nodejs.html

WORKDIR /app

COPY . ./
RUN npm ci

# build app
RUN npm run build

CMD npm run start
