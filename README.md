# Anonymous Feedback for Canvas

Collect course feedback anonymously. More info [here](http://help.canvas.yale.edu/m/55452/l/705131-anonymous-feedback-tool)

## Dev Setup (Docker Compose)

1. Install [Docker Desktop](https://www.docker.com/get-started/)

2. Install [ngrok](https://ngrok.com/download) - Allows us to connect from Canvas to localhost via SSL

   - Run ngrok to expose localhost:3000 via SSL: `ngrok http 3000`
   - We will use the HTTPS URL when creating the Canvas Developer Key

3. LTI 1.3 Authentication Setup

   - Login to Your Canvas instance as an admin.
   - Create LTI Key through: `Admin -> Developer Keys -> +Developer Key -> +LTI Key`
   - Add Key Settings:
     - Select `Paste JSON` under `Configure -> Method`. Copy from `lti13-config.json`, making sure to update the below parameters
       ```json
       "public_jwk": {
        "e": "<E>",
        "n": "<N>",
        "alg": "<ALG>",
        "kid": "<KID>",
        "kty": "<KTY>",
        "use": "<USE>"
        }
       "target_link_uri": "https://<NGROK_HOST>",
       "oidc_initiation_url": "https://<NGROK_HOST>/api/auth/lti"
       ```
     - Update Key Name: `<Your Name> Feedback Key`
     - Update Redirect URIs: `https://<NGROK_HOST>/api/auth/lti`

4. Update Backend Environment Variables:

   - Copy `backend/dev.env.template` to a new file named `backend/dev.env`
   - Update variables flagged with `TODO`

5. Update Frontend Environment Variables:

   - Copy `docker-compose.yml.template` to a new file named `docker-compose.yml`
   - Update variables flagged with `TODO`

6. Build & Run App at the root project level: `docker-compose up`

   - Code changes are automaticaly refreshed in dev mode.
   - Restarts are only needed when adding new dependencies or updating environment variables
   - After adding new dependencies, run the following: 1) `docker-compose down` 2) `docker-compose up --build`

7. Install App in Test Course:
   - Navigate to `Settings -> Apps -> View App Configurations -> +App`
   - Under configuration type, select `By Client ID` and paste your Developer Key ID
   - You may need to enable the tool visibility under: `Settings -> Navigation`


## Dev Setup (w/o Docker Compose)

1. Follow steps 2-4 from the Dev Setup (Docker Compose) section the same as before.

2. Update Frontend variables

   - Copy `frontend/.env.local.template` to a new file named `frontend/.env.local`
   - Complete all missing information

3. Build and run app (frontend and backend)

   - Navigate to the location of the `frontend` folder in a terminal. If not done already, make sure the packages have been installed using `npm install`.
   - Run `npm run dev` to start the application frontend
   - In another terminal, navigate to the location of the `backend` folder. If not done already, make sure the packages have been installed using `npm install`.
   - Run `npm run dev` or (`npm run win-dev` if using windows) to start the application backend

4. Install App in Test Course (same steps as Docker compose):
   - Navigate to `Settings -> Apps -> View App Configurations -> +App`
   - Under configuration type, select `By Client ID` and paste your Developer Key ID
   - You may need to enable the tool visibility under: `Settings -> Navigation`
