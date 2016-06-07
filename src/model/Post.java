package model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@XmlRootElement
@JsonIgnoreProperties 
@Table(name = "post")
public class Post {

	@Id
	@Column(name="id")
	private String id;
	private String updated_time;
	private String message;	
			
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	// TODO - have to set them to NotNull, check
	@Column(name="updated_time")
	public String getUpdated_time() {
		return updated_time;
	}

	public void setUpdated_time(String updated_time) {
		this.updated_time = updated_time;
	}

	// TODO - check whether Id annotation required
	@Id
	@Column(name="message")
	public String getMessage() {
		return message;
	}

	public void setMessage(String name) {
		this.message = name;
	}

}