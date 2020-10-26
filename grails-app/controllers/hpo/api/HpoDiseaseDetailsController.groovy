package hpo.api

import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses


@Api(value = "/api/hpo", tags = ["Disease"])
class HpoDiseaseDetailsController {
	static responseFormats = ['json']
    HpoDiseaseDetailsService hpoDiseaseDetailsService

  @ApiOperation(
    value = "Get disease details ( term and gene associations ) by disease Id",
    nickname = "disease/{diseaseId}",
    produces = "application/json",
    httpMethod = "GET"
  )
  @ApiResponses([
    @ApiResponse(code = 404, message = "Something was wrong with the request")]
  )
  @ApiImplicitParams([
    @ApiImplicitParam(name = "diseaseId",
      paramType = "path",
      required = true,
      value = "OMIM or ORPHA id",
      example = "OMIM:154700",
      dataType = "string")])
    def searchDisease(String id){
      def res = hpoDiseaseDetailsService.searchDisease(id)
      if(res.disease != ''){
        render(view: 'searchDisease', model: [resultMap: res])
      } else {
        render(view:'/notFound')
      }
    }
  }
