import io.github.bonigarcia.wdm.ChromeDriverManager
import io.github.bonigarcia.wdm.WebDriverManager
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.htmlunit.HtmlUnitDriver
import org.openqa.selenium.phantomjs.PhantomJSDriver


def defaultBrowserSize = { driver ->
  driver.manage().window().size = [1400, 1080]
  driver
}

def defaultChromeConfig = {
  WebDriverManager.chromedriver().setup()
  ChromeOptions chromeOptions = new ChromeOptions()
  if(System.getProperty('chromeHeadless')){
    chromeOptions.addArguments('--headless')
  }
  defaultBrowserSize(new ChromeDriver(chromeOptions))
}
environments {

  htmlUnit {
    driver = { new HtmlUnitDriver() }
  }

  chrome {driver = defaultChromeConfig
  }

  firefox {
    driver = { new FirefoxDriver() }
  }

  phantomJs {
    driver = { new PhantomJSDriver() }
  }
}

waiting {
  timeout = 5
}
atCheckWaiting = true
cacheDriverPerThread = true

reportsDir = System.getProperty('reportsDir','build/reports/geb')

if(System.getProperty('geb.env')==null){
  driver = defaultChromeConfig
}
