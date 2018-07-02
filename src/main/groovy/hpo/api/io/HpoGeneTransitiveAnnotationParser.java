package hpo.api.io;


import org.monarchinitiative.phenol.io.base.TermAnnotationParser;
import org.monarchinitiative.phenol.io.base.TermAnnotationParserException;
import org.monarchinitiative.phenol.ontology.data.TermId;
import org.monarchinitiative.phenol.formats.hpo.HpoGeneAnnotation;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

/**
 * Parser for "genes to phenotype annotation" files.
 *
 * <p>
 * <b>Usage Example</b>
 * </p>
 *
 * <pre>
 * File inputFile = new File("genes_to_phenotype.txt");
 * try {
 *   HpoGeneTransitiveAnnotationParser parser = new HpoGeneTransitiveAnnotationParser(inputFile);
 *   while (parser.hasNext()) {
 *     HpoGeneAnnotation anno = parser.next();
 *     // ...
 *   }
 * } catch (IOException e) {
 *    e.printStackTrace();
 *    System.err.println("Problem reading from file.");
 * } catch (TermAnnotationParserException e) {
 *    e.printStackTrace();
 *    System.err.println("Problem reading from file.");
 * }
 * </pre>
 *
 * @author <a href="mailto:michael.gargano@jax.org">Michael Gargano</a>
 */
public class HpoGeneTransitiveAnnotationParser implements TermAnnotationParser<HpoGeneAnnotation> {

  /** Expected header string. */
  private static final String EXPECTED_HEADER =
   "#Format: HPO-ID<tab>HPO-Name<tab>Gene-ID<tab>Gene-Name";

  /**
   * The {@link File} to read from.
   */
  private final File file;

  /**
   * The {@link BufferedReader} to use for reading line-wise.
   */
  private final BufferedReader reader;

  /** The next line. */
  private String nextLine;

  /**
   * Create new parser for HPO Phenotype to Genes files.
   *
   * @param file The file to read from.
   *
   * @throws IOException In case of problems with opening and reading from <code>file</code>.
   * @throws TermAnnotationParserException If there are problems with the file's header.
   */
  public HpoGeneTransitiveAnnotationParser(File file) throws IOException, TermAnnotationParserException {
    this.file = file;
    this.reader = new BufferedReader(new FileReader(file));
    this.nextLine = reader.readLine();
    checkHeader();
  }

  /**
   * Read first line and check header.
   *
   * @throws TermAnnotationParserException If the header is not as expected.
   * @throws IOException If there is a problem with reading from the file.
   */
  private void checkHeader() throws TermAnnotationParserException, IOException {
    if (!EXPECTED_HEADER.equals(nextLine)) {
      throw new TermAnnotationParserException("First line is not the expected header. \"" + nextLine
        + "\" vs. \"" + EXPECTED_HEADER + "\" (expected)");
    }
    nextLine = reader.readLine();
  }

  @Override
  public boolean hasNext() {
    return nextLine != null;
  }

  @Override
  public HpoGeneAnnotation next() throws IOException, TermAnnotationParserException {
    final String[] arr = nextLine.split("\t");
    final TermId hpoTermId = TermId.constructWithPrefix(arr[0]);
    final String hpoTermName = arr[1];
    final int geneId = Integer.parseInt(arr[2]);
    final String geneSymbol = arr[3];
    nextLine = reader.readLine();
    return new HpoGeneAnnotation(geneId, geneSymbol, hpoTermName, hpoTermId);
  }

  @Override
  public void close() throws IOException {
    reader.close();
  }

  @Override
  public File getFile() {
    return file;
  }

}
