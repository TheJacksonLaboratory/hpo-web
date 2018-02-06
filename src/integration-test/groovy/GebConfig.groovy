import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.htmlunit.HtmlUnitDriver
import org.openqa.selenium.phantomjs.PhantomJSDriver

def defaultChromeConfig = {
  ChromeOptions chromeOptions = new ChromeOptions()
  if(System.getProperty('chromeHeadless')){
    chromeOptions.addArguments('--headless')
  }
  new ChromeDriver(chromeOptions)
}
environments {

  htmlUnit {
    driver = { new HtmlUnitDriver() }
  }

  chrome {driver = defaultChromeConfig
    //driver = { new ChromeDriver()}
  }

  firefox {
    driver = { new FirefoxDriver() }
  }

  phantomJs {
    driver = { new PhantomJSDriver() }
  }
}

//waiting{
//  timeout = 20
//}
//atCheckWaiting = true
//cacheDriverPerThread = true

//baseUrl = System.getProperty('baseUrl','http://localhost:8080')
//reportsDir = System.getProperty('reportsDir','build/reports/geb')

if(System.getProperty('geb.env')==null){
  driver = defaultChromeConfig
}
