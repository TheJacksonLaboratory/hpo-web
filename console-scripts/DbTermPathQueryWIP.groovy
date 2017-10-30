import org.hibernate.FetchMode as FM

def c = DbTermPath.createCriteria()
List<DbTermPath> dbTermPathList = c.list(max:50){
    like('pathNames', '% limbs%')
    order("pathNames", "asc")
    fetchMode("dbTerm", FM.JOIN)
}
dbTermPathList.each{   
    println(it.pathNames)
}
null