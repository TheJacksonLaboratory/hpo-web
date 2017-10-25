package hpo.api

import hpo.api.db.DbTermAdminService
import org.springframework.beans.factory.annotation.Autowired

class BootStrap {

    DbTermAdminService dbTermAdminService
    def init = { servletContext ->

//        dbTermAdminService.deleteDbTerms()
//        dbTermAdminService.refreshDbTerms()

    }
    def destroy = {
    }


}
