import React from 'react';

const Deployment = () => {
    return (
        <div>
            <h1>Deployment Strategies for React Applications</h1>
            <p>Deploying a React application can be done in several ways. Here are some common strategies:</p>
            <h2>1. Deploying to Static Hosting Services</h2>
            <p>Static hosting services like Vercel, Netlify, and GitHub Pages are great for deploying React applications. They provide easy integration with Git repositories and automatic deployments on push.</p>
            <h3>Steps to Deploy on Netlify:</h3>
            <ol>
                <li>Build your React application using <code>npm run build</code>.</li>
                <li>Sign up for a Netlify account.</li>
                <li>Drag and drop your <code>build</code> folder into the Netlify dashboard.</li>
                <li>Configure your domain settings if needed.</li>
            </ol>

            <h2>2. Deploying to Cloud Providers</h2>
            <p>Cloud providers like AWS, Google Cloud, and Azure allow for more control and scalability. You can deploy your React app as a static site or as part of a larger application stack.</p>
            <h3>Example: Deploying on AWS S3</h3>
            <ol>
                <li>Create an S3 bucket and enable static website hosting.</li>
                <li>Upload your <code>build</code> folder contents to the bucket.</li>
                <li>Set the appropriate permissions for public access.</li>
                <li>Access your application via the S3 bucket URL.</li>
            </ol>

            <h2>3. Deploying with Docker</h2>
            <p>Docker can be used to containerize your React application, making it easy to deploy across different environments.</p>
            <h3>Basic Dockerfile Example:</h3>
            <pre>
                <code>
                    {`
                    FROM node:14 AS build
                    WORKDIR /app
                    COPY package.json ./
                    RUN npm install
                    COPY . .
                    RUN npm run build

                    FROM nginx:alpine
                    COPY --from=build /app/build /usr/share/nginx/html
                    EXPOSE 80
                    CMD ["nginx", "-g", "daemon off;"]
                    `}
                </code>
            </pre>

            <h2>Conclusion</h2>
            <p>Choosing the right deployment strategy depends on your application's requirements and your team's expertise. Always consider factors like scalability, cost, and ease of use when selecting a deployment method.</p>
        </div>
    );
};

export default Deployment;