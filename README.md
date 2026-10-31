# Student Management – DevOps Project

Node.js + Express REST app with a small web UI, taken through Git, Jenkins, Docker and Kubernetes.

## API
| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Health check |
| GET | /students | List all |
| GET | /students/:id | Get one |
| POST | /students | Create (name, email, course) |
| PUT | /students/:id | Update |
| DELETE | /students/:id | Delete |

## 1. Run locally
    npm install
    npm start          # http://localhost:3000
    npm test           # Jest + Supertest

## 2. Git & GitHub
    git init
    git add .
    git commit -m "Initial commit: Student Management app"
    git branch -M main
    # create an empty repo on github.com first, then:
    git remote add origin https://github.com/<your-username>/student-management.git
    git push -u origin main

Other commands to demonstrate:

    git status
    git log --oneline
    git checkout -b feature/validation     # create branch
    git diff
    git add . && git commit -m "Add validation"
    git checkout main && git merge feature/validation
    git pull origin main
    git push origin main

## 3. Jenkins
1. Install Jenkins; install Node.js and Docker on the Jenkins machine
   (add the `jenkins` user to the `docker` group, then restart Jenkins).
2. Dashboard -> New Item -> name it `student-management` -> **Pipeline** -> OK.
3. Pipeline section: *Pipeline script from SCM* -> Git -> your GitHub repo URL -> branch `*/main`
   -> Script Path `Jenkinsfile`.
4. (Optional auto trigger) Build Triggers -> *Poll SCM* -> `H/5 * * * *`,
   or use a GitHub webhook to `http://<jenkins-host>:8080/github-webhook/`.
5. Click **Build Now** and screenshot the stage view and console output.

## 4. Docker
    docker build -t student-management:latest .
    docker run -d --name student-app -p 3000:3000 student-management:latest
    docker ps
    docker logs student-app
    # open http://localhost:3000
    docker stop student-app && docker rm student-app

## 5. Kubernetes (Minikube)
    minikube start
    eval $(minikube docker-env)                 # Windows PowerShell: & minikube docker-env | Invoke-Expression
    docker build -t student-management:latest . # build INSIDE minikube's Docker
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
    kubectl get deployments,pods,svc
    minikube service student-management-service --url   # open this URL

Scale / clean up:

    kubectl scale deployment student-management --replicas=3
    kubectl delete -f k8s/

## 6. Automated tests
`test/student.test.js` has 6 test cases (Jest + Supertest) covering health, list, create,
validation error (400), not found (404) and update/delete. Jenkins runs them in the *Test* stage.
