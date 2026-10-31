pipeline {
    agent any

    environment {
        IMAGE_NAME = 'student-management'
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Install Dependencies') {
            steps { bat 'npm install' }
        }
        stage('Test') {
            steps { bat 'npm test' }
        }
        stage('Docker Build') {
            steps { bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% -t %IMAGE_NAME%:latest .' }
        }
    }

    post {
        success { echo 'Build, tests and Docker image completed successfully.' }
        failure { echo 'Pipeline failed. Check the console output.' }
    }
}