package com.kc.smartAirline.repo;

import com.kc.smartAirline.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepo extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    List<User> findByRoles_Role(String role);


//  @Query("SELECT u FROM User u WHERE u.roles r WHERE r.name = :roleNames")
//    List<User> findByRoleName(@Param("roleName")String roleName);
}
