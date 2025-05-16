# Scheduler_ui

This is the repo for the scheduler_ui, It plugs into the Scheduler_backend's API and helps manage tasks
server authentication, proxies, and more.

The scheduler_ui offers localstorage saves for target servers allowing for runtime server changes, so you can host multiple backends 
and manage them using a single instance of the UI, more on that below. 


## Features

- Authenticating to backend server
- Managing Tasks (Aka Jobs)
- Managing Proxies
- Managing Databases
- ...

## 📦 Deployment

- Deploying The UI is done best when using Docker, a `DOCKERFILE` is provided with an nginx Reverse Proxy serving the built UI.
- A `compose.yml` file is also provided just for reference, some environment variables are accepted during build time,

### Build Time Environment Variables

| Variable Name                | Description                                                                          | Default Value     |
|------------------------------|--------------------------------------------------------------------------------------|-------------------|
| SERVER_ENDPOINT              | The endpoint of the target server                                                     | /                 |

## 🛠 Usage

Using the UI is as simple as running docker with the compose file.

```sh
docker compose up
```

to run the container in command line you can use the followign command :

```sh
docker run -p 80:80 ghcr.io/moda20/scheduler_ui:latest
```

The best way to use the scheduler_ui is to deploy it alongside an instance of the scheduler_backend. (see the starter repo)


## Development

The frontend is built using [vite](https://vite.dev/) and [react](https://react.dev/), [redux](https://redux.js.org/)/[react-redux](https://react-redux.js.org/), and [shadcn](https://ui.shadcn.com/), and [tailwindcss](https://tailwindcss.com/) are used for components and styling.

To run the frontend app locally :
- Clone the repo : `git clone https://github.com/moda20/scheduler_ui.git`
- Install the dependencies : `npm install`
- Run the app : `npm start`
- to build the app run : `npm run build`

The app is self contained and will **not need** any extra configurations


## 📝 License

TBD

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
Please take the time to debug your issues and test your pull request changes if they need to, adding runnable tests
would be much appreciated. 
