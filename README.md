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
    npm test           # Karate API tests (needs Java)

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
1. Install Jenkins; install Node.js, Java and Docker on the Jenkins machine
   (add the `jenkins` user to the `docker` group, then restart Jenkins).
2. Dashboard -> New Item -> name it `student-management` -> **Pipeline** -> OK.
3. Pipeline section: *Pipeline script from SCM* -> Git -> your GitHub repo URL -> branch `*/main`
   -> Script Path `Jenkinsfile`.
4. Build trigger: Build Triggers -> *Poll SCM* -> `H/2 * * * *`
   (Jenkins checks GitHub every 2 minutes and builds automatically when there is a new commit).
5. Push a commit, wait for the automatic build (the console shows "Started by an SCM change"),
   and screenshot the stage view and console output.

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

If the NodePort (30007) is not reachable from the browser, use port-forward instead:

    kubectl port-forward service/student-management-service 8081:80
    # open http://localhost:8081

Scale / clean up:

    kubectl scale deployment student-management --replicas=3
    kubectl delete -f k8s/

## 6. Automated tests
`karate/student.feature` has 5 Karate test scenarios covering health, list, create,
validation error (400) and not found (404). `npm test` runs `karate/run-karate.js`, which
downloads the Karate jar, starts the app on port 3456, runs the tests and stops the app.
Java is required. Jenkins runs them in the *Test* stage. The HTML report is in
`target/karate-reports/karate-summary.html`.