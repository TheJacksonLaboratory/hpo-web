# Human Phenotype Ontology (HPO) Web App

## Prerequisites

+ Grails 3.3 +
+ JDK 1.8 +
+ Git 2.14
+ Gradle 4.2

## Setup

+ Clone the repo

        git clone https://bitbucket.jax.org/scm/hpo/hpo-web.git
        

+ Change directory to hpo-web

        cd hpo-web
+ Execute local_db_init.sql in sql-scripts/

+ Execute initDb.groovy in console-scripts/

         Make sure to execute each load function seperately for now.
         
         * Always start from fresh Database if you want to reload data.
        

+ Validate the client and backend components build by executing:

        ./gradlew build

## Usage

+ Run the application

        ./gradlew bootRun

+ To open the application site launch the browser and go to
 
        http://<host>:8080 gr

+ If client (Angular App) hot reload is desired open a new shell and execute

        ./gradlew buildClientWatch

+ Optionally to open the client (Angular app) via Cli

  * Change directory to hpo-web/src/main/client
  
        cd hpo-web/src/main/client  
  * Execute
  
        ng serve --open (will open application in the browser using port 4200)
  * Note: Review README file in hpo-web/src/main/client  

## Unit Testing

+ To execute the client (Angular app) unit tests run
  
      ./gradlew clientTest

+ To execute backend and client unit tests run
  
      ./gradlew test
    
## Other
+ To see possible gradle tasks execute
  
      ./gradlew tasks
      
+ To delete the previous build execute

      ./gradlew clean
      

