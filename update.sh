#!/bin/bash
# Exit if command fails
set -e
# keep track of the last executed command
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
# echo an error message before exiting
trap 'echo "\"${last_command}\" command filed with exit code $?."' EXIT

# OMIM 2 GENE
if [ -f src/main/resources/mim2gene_medgen.txt ]; then
	mv src/main/resources/mim2gene_medgen.txt src/main/resources/mim2gene_medgen.txt.old
fi
wget -O src/main/resources/mim2gene_medgen.txt ftp://ftp.ncbi.nlm.nih.gov/gene/DATA/mim2gene_medgen

# HPO OBO
if [ -f src/main/resources/hp_mostrecent.obo ]; then
	mv src/main/resources/hp_mostrecent.obo src/main/resources/hp_mostrecent.obo.old
fi
wget -O src/main/resources/hp_mostrecent.obo https://raw.githubusercontent.com/obophenotype/human-phenotype-ontology/master/hp.obo

# ORPHANET 2 GENE
if [ -f src/main/resources/orphanet_disease2gene.xml ]; then
	mv src/main/resources/orphanet_disease2gene.xml src/main/resources/orphanet_disease2gene.xml.old
fi
wget -O src/main/resources/orphanet_disease2gene.xml http://www.orphadata.org/data/xml/en_product6.xml

# GENE INFO 
if [ -f src/main/resources/Homo_sapiens.gene_info.gz ]; then
        mv src/main/resources/Homo_sapiens.gene_info.gz src/main/resources/Homo_sapiens.gene_info.gz.old
fi
wget -O src/main/resources/Homo_sapiens.gene_info.gz ftp://ftp.ncbi.nih.gov/gene/DATA/GENE_INFO/Mammalia/Homo_sapiens.gene_info.gz

# PHENOTYPE HPOA
if [ -f src/main/resources/phenotype.hpoa ]; then
        mv src/main/resources/phenotype.hpoa src/main/resources/phenotype.hpoa.old
fi
wget -O src/main/resources/phenotype.hpoa http://compbio.charite.de/jenkins/job/hpo.annotations.current/lastSuccessfulBuild/artifact/misc_2018/phenotype.hpoa

# EXIT
exit 0;
