import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions

environments {

  // run via “./gradlew -Dgeb.env=chrome iT”
  chrome {
    driver = { new ChromeDriver() }
  }

  // run via “./gradlew -Dgeb.env=chromeHeadless iT”
  chromeHeadless {
    driver = {
      ChromeOptions o = new ChromeOptions()
      o.addArguments('headless')
      new ChromeDriver(o)
    }
  }

}

waiting {
  timeout = 30
  retryInterval = 1.0
}

atCheckWaiting = true
cacheDriverPerThread = true

reportsDir = System.getProperty('reportsDir','server/build/reports/geb')
