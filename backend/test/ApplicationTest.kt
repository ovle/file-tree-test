package main

import io.ktor.http.*
import kotlin.test.*
import io.ktor.server.testing.*
import module

@Ignore
class ApplicationTest {
    @Test
    fun testRoot() {
        withTestApplication({ module(testing = true) }) {
            handleRequest(HttpMethod.Get, "/files/123").apply {
                assertEquals(HttpStatusCode.OK, response.status())
            }
        }
    }
}