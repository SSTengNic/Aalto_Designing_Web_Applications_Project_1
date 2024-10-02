TODO: There are performance tests written with k6 that are used for (1) measuring the performance of loading the assignment page and (2) measuring the performance of submitting assignments. The test results are outlined in the PERFORMANCE_TEST_RESULTS.md that is included in the assignment template.

# Performance test results

Brief description of the used server (choose one): HTTP/1.1

Brief description of your computer:
System Model: HP ENVY x360 13
Processor: AMD Ryzen 7 4700U with Radeon Graphics, 2000 Mhz, 8 Core(s), 8 Logical Processor(s)
Installed Physical Memory (RAM): 16.0 GB

### Loading the assignment page

http_reqs: 94 17.171161/s
http_req_duration - average: 555.82ms
http_req_duration - median: 562.67ms
http_req_duration - 99th percentile: 645.79ms

### Posting submissions

http_reqs: 94 17.171161/s
http_req_duration - average: 22.59ms
http_req_duration - median: 17.17ms
http_req_duration - 99th percentile: 79.05ms
