### Install:

`npm install -g fatapp`

### Basic usage:

    fatapp - a dirty NPM dependency analysis tool
    ====================================================================

    fatapp [-s | --sort] [-n  | --loads] [<filepath>]

    Options:

    [<path>]        - 'package-lock.json' or directory an NPM project (defaults: './package-lock.json')
    [-s | --sort]   - sort by 'size', 'time', 'name' (defaults: 'size')
    [-n | --loads]  - number of times to require a NPM package for average times (defaults: 1)
    [-a | --all]    - include development dependencies in scanning (defaults: off)

    ====================================================================
    File size will be the compress TGZ NPM package.
    Load times are captured from a blank preload: 'node -r "express" -e ""'

    WARN: This package make lazy use of 'execSync', do not use in production environments


### Example Output:

#### By size (default):

`fatapp`

    fatapp - scanning: './'
    ====================================================================
    right-pad@1.0.1                          size:       1 KB in: 113 ms
    number-is-nan@1.0.1                      size:       1 KB in: 70 ms
    strip-ansi@3.0.1                         size:       2 KB in: 72 ms
    code-point-at@1.1.0                      size:       2 KB in: 71 ms
    has-unicode@2.0.1                        size:       2 KB in: 71 ms
    wide-align@1.1.2                         size:       2 KB in: 76 ms
    string-width@1.0.2                       size:       2 KB in: 78 ms
    is-fullwidth-code-point@1.0.0            size:       2 KB in: 67 ms
    ansi-regex@2.1.1                         size:       2 KB in: 105 ms
    object-assign@4.1.1                      size:       3 KB in: 69 ms
    left-pad@1.2.0                           size:       3 KB in: 84 ms
    console-control-strings@1.1.0            size:       3 KB in: 82 ms
    aproba@1.2.0                             size:       3 KB in: 68 ms
    signal-exit@3.0.2                        size:       4 KB in: 71 ms
    deepmerge@2.1.0                          size:       6 KB in: 77 ms
    minimist@1.2.0                           size:       8 KB in: 80 ms
    gauge@2.7.4                              size:      16 KB in: 87 ms
    underscore@1.8.3                         size:      33 KB in: 142 ms
    fibers@2.0.0                             size:     594 KB in: 73 ms
    --------------------------------------------------------------------
    Finished in: 2349ms
    --------------------------------------------------------------------
    These are TGZ compressed sizes of the whole NPM module, but 
    should give a relativistic idea of package weight
    
    
#### By require time:

`fatapp -s time ./`

    fatapp - scanning: './'
    ====================================================================
    object-assign@4.1.1                      size:       3 KB in: 64 ms
    number-is-nan@1.0.1                      size:       1 KB in: 68 ms
    signal-exit@3.0.2                        size:       4 KB in: 68 ms
    strip-ansi@3.0.1                         size:       2 KB in: 68 ms
    wide-align@1.1.2                         size:       2 KB in: 68 ms
    console-control-strings@1.1.0            size:       3 KB in: 69 ms
    left-pad@1.2.0                           size:       3 KB in: 69 ms
    string-width@1.0.2                       size:       2 KB in: 70 ms
    is-fullwidth-code-point@1.0.0            size:       2 KB in: 70 ms
    fibers@2.0.0                             size:     594 KB in: 72 ms
    deepmerge@2.1.0                          size:       6 KB in: 72 ms
    ansi-regex@2.1.1                         size:       2 KB in: 73 ms
    aproba@1.2.0                             size:       3 KB in: 73 ms
    has-unicode@2.0.1                        size:       2 KB in: 73 ms
    minimist@1.2.0                           size:       8 KB in: 74 ms
    right-pad@1.0.1                          size:       1 KB in: 74 ms
    code-point-at@1.1.0                      size:       2 KB in: 74 ms
    underscore@1.8.3                         size:      33 KB in: 77 ms
    gauge@2.7.4                              size:      16 KB in: 88 ms
    --------------------------------------------------------------------
    Finished in: 2145ms
    --------------------------------------------------------------------
    These are TGZ compressed sizes of the whole NPM module, but 
    should give a relativistic idea of package weight


#### By require name:

`fatapp --sort name`

    fatapp - scanning: '.'
    ====================================================================
    ansi-regex@2.1.1                         size:       2 KB in: 88 ms
    aproba@1.2.0                             size:       3 KB in: 70 ms
    code-point-at@1.1.0                      size:       2 KB in: 72 ms
    console-control-strings@1.1.0            size:       3 KB in: 71 ms
    deepmerge@2.1.0                          size:       6 KB in: 69 ms
    fibers@2.0.0                             size:     594 KB in: 69 ms
    gauge@2.7.4                              size:      16 KB in: 85 ms
    has-unicode@2.0.1                        size:       2 KB in: 67 ms
    is-fullwidth-code-point@1.0.0            size:       2 KB in: 90 ms
    left-pad@1.2.0                           size:       3 KB in: 114 ms
    minimist@1.2.0                           size:       8 KB in: 71 ms
    number-is-nan@1.0.1                      size:       1 KB in: 80 ms
    object-assign@4.1.1                      size:       3 KB in: 83 ms
    right-pad@1.0.1                          size:       1 KB in: 70 ms
    signal-exit@3.0.2                        size:       4 KB in: 102 ms
    string-width@1.0.2                       size:       2 KB in: 80 ms
    strip-ansi@3.0.1                         size:       2 KB in: 70 ms
    underscore@1.8.3                         size:      33 KB in: 78 ms
    wide-align@1.1.2                         size:       2 KB in: 69 ms
    --------------------------------------------------------------------
    Finished in: 2292ms
    --------------------------------------------------------------------
    These are TGZ compressed sizes of the whole NPM module, but 
    should give a relativistic idea of package weight


#### With dev dependacies:

`fatapp --all ./example`

##### Progress meter:

    fatapp - scanning: './example'
    ====================================================================
    ⸨  ░░░░░░░░░░░░░░░░⸩ ⠧ Profiling 116 of 997 > lodash@4.17.4


ಠ_ಠ 997 deps w/ dev, 143 without --all


##### Output:

    fatapp - scanning: './example'
    ====================================================================
    fs@0.0.2                                 size:  303 Bytes in: 67 ms
    raw-loader@0.5.1                         size:  660 Bytes in: require failed.
    indexof@0.0.1                            size:  698 Bytes in: 70 ms
    babel-plugin-syntax-jsx@6.18.0           size:  720 Bytes in: require failed.
    babel-plugin-syntax-flow@6.18.0          size:  726 Bytes in: require failed.
    babel-plugin-syntax-decorators@6.13.0    size:  731 Bytes in: require failed.
    babel-plugin-syntax-async-functions@6.13.0 size:  737 Bytes in: require failed.
    babel-plugin-syntax-dynamic-import@6.18.0 size:  743 Bytes in: require failed.
    babel-plugin-syntax-async-generators@6.13.0 size:  743 Bytes in: require failed.
    babel-plugin-syntax-class-properties@6.13.0 size:  744 Bytes in: require failed.
    is-path-cwd@1.0.0                        size:  745 Bytes in: require failed.
    babel-plugin-syntax-object-rest-spread@6.13.0 size:  746 Bytes in: require failed.
    babel-plugin-syntax-exponentiation-operator@6.13.0 size:  752 Bytes in: require failed.

< reacted output >

    http-server@0.10.0                       size:     461 KB in: require failed.
    less@2.7.3                               size:     490 KB in: require failed.
    ajv@4.11.8                               size:     495 KB in: require failed.
    react-dom@15.4.2                         size:     517 KB in: 189 ms
    core-js@2.5.3                            size:     573 KB in: 381 ms
    node-forge@0.6.33                        size:     589 KB in: require failed.
    ecstatic@2.2.1                           size:     707 KB in: require failed.
    caniuse-db@1.0.30000783                  size:       1 MB in: require failed.
    fsevents@1.1.3                           size:       2 MB in: require failed.
    iltorb@1.3.4                             size:       2 MB in: require failed.
    react-phone-number-input@0.15.2          size:       4 MB in: 258 ms
    flow-bin@0.63.1                          size:       8 MB in: require failed.
    --------------------------------------------------------------------
    Finished in: 100032ms
    --------------------------------------------------------------------
    These are TGZ compressed sizes of the whole NPM module, but 
    should give a relativistic idea of package weight
    
    

###### Note:

`required failed.` is common for development depencancies, I haven't investgated why, most likely this is due to babel use. This package was written just to check a quick idea of where package weight and time is. Enjoy.

