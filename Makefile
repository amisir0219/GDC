# OSS-Fuzz will define its own value for LIB_FUZZING_ENGINE.
LIB_FUZZING_ENGINE ?= standalone.o

# Values for CC, CFLAGS, CXX, CXXFLAGS are provided by OSS-Fuzz.
# Outside of OSS-Fuzz use the ones you prefer or rely on the default values.
# Do not use the -fsanitize=* flags by default.
# OSS-Fuzz will use different -fsanitize=* flags for different builds (asan, ubsan, msan, ...)

# You may add extra compiler flags like this:
CXXFLAGS += -std=c++11

clean:
	rm -fv *.a *.o *unittest *_fuzzer *_seed_corpus.zip crash-* *.zip


standalone.o: ExampleFuzzer.java
