/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.torre.servlet;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import javax.net.ssl.HttpsURLConnection;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created Servlet to fetch specific people bio because the client API in
 * blocked by the browser under CORS policy.
 *
 * @author harshita.sethi
 */
public class GetPeople extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String userID = request.getParameter("userID");

        URL url = new URL("https://bio.torre.co/api/bios/" + userID);

        URLConnection connection = url.openConnection();
//        HttpURLConnection httpConn = (HttpURLConnection) connection;
        HttpsURLConnection httpConn = (HttpsURLConnection) connection;
        ByteArrayOutputStream bout = new ByteArrayOutputStream();
        httpConn.setDoOutput(true);
        httpConn.setRequestMethod("GET");
        httpConn.setRequestProperty("Content-Type", "application/json");
        httpConn.connect();

        String responseString = "";
        StringBuilder reportData = new StringBuilder();

        if (httpConn.getResponseCode() == 200) {
            //Read the response.
            InputStreamReader isr = new InputStreamReader(httpConn.getInputStream());
            BufferedReader in = new BufferedReader(isr);

            //Write the response to a String.
            while ((responseString = in.readLine()) != null) {
                reportData.append(responseString).append(" \n");
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(reportData.toString());
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
