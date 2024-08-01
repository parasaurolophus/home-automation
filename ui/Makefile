# use recursive target invocations to force serial execution, even when -j is
# in use and in the absence of working versions of .WAIT or .NOTPARALLEL
all:
	$(MAKE) clean
	$(MAKE) build

clean:
	if [ -d dist ]; then rm -rf dist; fi

build:
	npm run build
