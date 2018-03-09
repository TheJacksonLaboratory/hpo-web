package hpo.api

import org.springframework.core.io.ResourceLoader

class ContentTypeAssetController implements org.springframework.context.ResourceLoaderAware {
   ResourceLoader resourceLoader

    def setCharEncoding(String contentType) {

      String requestURI = request.getProperty('requestURI')
      File file  = resourceLoader.getResource(requestURI).getFile()
      render(file: file, contentType: contentType)

    }

  @Override
  void setResourceLoader(ResourceLoader resourceLoader) {
    this.resourceLoader = resourceLoader
  }
}
