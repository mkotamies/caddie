'use strict';

angular.module('MockFeeder', [])
    .value('clubJSON', [{
        "name" : "Vihti Golf",
        "courses" : [
            {
                "tee": "yellow",
                "slope": 127,
                "cr": 71.3,
                "par" : 72,
                "holes": {
                    "1": {
                        "par": 4,
                        "length": 319,
                        "hcp": 5
                    },
                    "2": {
                        "par": 4,
                        "length": 372,
                        "hcp": 2
                    },
                    "3": {
                        "par": 4,
                        "length": 365,
                        "hcp": 4
                    },
                    "4": {
                        "par": 3,
                        "length": 197,
                        "hcp": 1
                    },
                    "5": {
                        "par": 5,
                        "length": 506,
                        "hcp": 7
                    },
                    "6": {
                        "par": 5,
                        "length": 468,
                        "hcp": 9
                    },
                    "7": {
                        "par": 4,
                        "length": 313,
                        "hcp": 15
                    },
                    "8": {
                        "par": 3,
                        "length": 131,
                        "hcp": 18
                    },
                    "9": {
                        "par": 4,
                        "length": 344,
                        "hcp": 12
                    },
                    "10": {
                        "par": 4,
                        "length": 318,
                        "hcp": 8
                    },
                    "11": {
                        "par": 3,
                        "length": 149,
                        "hcp": 10
                    },
                    "12": {
                        "par": 4,
                        "length": 337,
                        "hcp": 11
                    },
                    "13": {
                        "par": 5,
                        "length": 430,
                        "hcp": 14
                    },
                    "14": {
                        "par": 4,
                        "length": 334,
                        "hcp": 3
                    },
                    "15": {
                        "par": 5,
                        "length": 476,
                        "hcp": 17
                    },
                    "16": {
                        "par": 4,
                        "length": 319,
                        "hcp": 16
                    },
                    "17": {
                        "par": 3,
                        "length": 153,
                        "hcp": 8
                    },
                    "18": {
                        "par": 4,
                        "length": 322,
                        "hcp": 13
                    }
                }
            },
            {
                "tee": "red",
                "slope": 119,
                "cr": 67.4,
                "par" : 72,
                "holes": {
                    "1": {
                        "par": 4,
                        "length": 284,
                        "hcp": 5
                    },
                    "2": {
                        "par": 4,
                        "length": 322,
                        "hcp": 2
                    },
                    "3": {
                        "par": 4,
                        "length": 311,
                        "hcp": 4
                    },
                    "4": {
                        "par": 3,
                        "length": 166,
                        "hcp": 1
                    },
                    "5": {
                        "par": 5,
                        "length": 432,
                        "hcp": 7
                    },
                    "6": {
                        "par": 5,
                        "length": 409,
                        "hcp": 9
                    },
                    "7": {
                        "par": 4,
                        "length": 257,
                        "hcp": 15
                    },
                    "8": {
                        "par": 3,
                        "length": 115,
                        "hcp": 18
                    },
                    "9": {
                        "par": 4,
                        "length": 303,
                        "hcp": 12
                    },
                    "10": {
                        "par": 4,
                        "length": 287,
                        "hcp": 8
                    },
                    "11": {
                        "par": 3,
                        "length": 118,
                        "hcp": 10
                    },
                    "12": {
                        "par": 4,
                        "length": 318,
                        "hcp": 11
                    },
                    "13": {
                        "par": 5,
                        "length": 389,
                        "hcp": 14
                    },
                    "14": {
                        "par": 4,
                        "length": 296,
                        "hcp": 3
                    },
                    "15": {
                        "par": 5,
                        "length": 411,
                        "hcp": 17
                    },
                    "16": {
                        "par": 4,
                        "length": 282,
                        "hcp": 16
                    },
                    "17": {
                        "par": 3,
                        "length": 132,
                        "hcp": 8
                    },
                    "18": {
                        "par": 4,
                        "length": 269,
                        "hcp": 13
                    }
                }
            }
        ]
    }]
);