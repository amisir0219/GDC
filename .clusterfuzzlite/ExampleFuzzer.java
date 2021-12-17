public class ExampleFuzzer {
    public static void fuzzerTestOneInput(byte[] input) {
        ...
        // Call a function of the project under test with arguments derived from
        // input and throw an exception if something unwanted happens.
        ...
    }
}
