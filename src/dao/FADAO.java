package dao;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.math.BigInteger;
import java.net.URI;
import java.net.URL;
import java.security.SecureRandom;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

import model.Post;
import model.SearchText;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import util.FBGroupsSearch;
import vo.PostVO;

public class FADAO {
	
	private static final String PERSISTENCE_UNIT_NAME = "FBGroupsSearch";
	private static EntityManagerFactory factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT_NAME);		
	private static SqlSessionFactory sqlMapper = null;
	
	public static List<PostVO> getAllPosts(String searchText) {
		
		SearchText searchText2 = new SearchText();
		searchText2.setText(searchText);
		savePost(searchText2);
		
		EntityManager em = factory.createEntityManager();
		String[] sArray = searchText.split(" ");
		List<Post> feeds = new ArrayList<Post>();
		for (String string : sArray) {
			Query checkEmailExists = em.createQuery("SELECT a FROM Post a WHERE lower(a.message) like lower(:searchText)");
	        checkEmailExists.setParameter("searchText", "%" + string + "%");
			List<Post> postsForString = (List<Post>) checkEmailExists.getResultList();
			feeds.addAll(postsForString);
		}
		
		List<PostVO> postVOs = new ArrayList<PostVO>();
		for (Post post : feeds) {
			PostVO postVO = new PostVO(post);
			postVOs.add(postVO);
		}
		return postVOs;
	}
	
	public static List<SearchText> getAllSearchTexts() {
		EntityManager em = factory.createEntityManager();
		Query checkEmailExists = em.createQuery("SELECT a FROM SearchText a");
		List<SearchText> feeds = (List<SearchText>) checkEmailExists.getResultList();
		return feeds;
	}
	
	public static void savePost(Object post) {
		factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT_NAME);
	    EntityManager em = factory.createEntityManager();

	    em.getTransaction().begin();
	    em.merge(post);
	    em.flush();	    
	    em.getTransaction().commit();
	    em.close();
	}


}
